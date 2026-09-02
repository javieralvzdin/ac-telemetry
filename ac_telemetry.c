#include <stdio.h>
#include <stdlib.h>
#include <string.h> 
#include <winsock2.h>
#include <windows.h>

#define EXPORT __declspec(dllexport)

SOCKET s = INVALID_SOCKET;

struct Handshake {
    int identifier;
    int version;
    int operationId;
};

// FORZANDO ALINEACION DE 1 BYTE PARA LEER EL PAQUETE DE RED TAL CUAL LLEGA
#pragma pack(push, 1) 
struct CarTelemetry {
    int identifier;
    int size;
    float speed_kmh;
    float speed_mph;
    float speed_ms;
    char isAbsEnabled;
    char isAbsInAction;
    char isTcInAction;  // CONTROL DE TRACCION SOLO EN LIBRE
    char isTcEnabled;
    char inPit;
    char engineLimiterOn;
    char padding[2]; // PARA ALINEAR LOS FLOATS
    float accG_vertical;
    float accG_horizontal;
    float accG_frontal;
    int lapTime;
    int lastLap;
    int bestLap;
    int lapCount;
    float gas;       // 0.0 a 1.0
    float brake;     // 0.0 a 1.0
    float clutch;    // 0.0 a 1.0
    float engineRPM;
    float steer;     // -1.0 a 1.0
    int gear;        // -1 (R), 0 (N), 1, 2, 3...
};

// Respuesta al Handshake (operationId=1): la envia Assetto Corsa una vez al
// suscribirse, con el nombre del coche y del circuito de la sesion activa.
// NOTA: layout tomado del protocolo UDP conocido de Assetto Corsa (wchar_t[100]
// = UTF-16 en Windows); no se ha podido verificar byte a byte contra el juego
// real desde este entorno, revisar si carName/trackName llegan vacios o con
// texto corrupto.
struct HandshakerResponse {
    wchar_t carName[100];
    wchar_t driverName[100];
    int identifier;
    int version;
    wchar_t trackName[100];
    wchar_t trackConfig[100];
};
#pragma pack(pop)

static struct HandshakerResponse g_session_info;
static int g_has_session_info = 0;

// Devuelve 1 si el socket quedo listo y el handshake se envio correctamente, 0 en caso de error.
// No confirma que Assetto Corsa haya recibido/respondido el handshake (UDP), solo que el envio local no fallo.
EXPORT int init_telemetry() {
    WSADATA wsa;
    struct sockaddr_in server;

    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) {
        return 0;
    }

    s = socket(AF_INET, SOCK_DGRAM, 0);
    if (s == INVALID_SOCKET) {
        WSACleanup();
        return 0;
    }

    u_long mode = 1;
    if (ioctlsocket(s, FIONBIO, &mode) != 0) {
        closesocket(s);
        s = INVALID_SOCKET;
        WSACleanup();
        return 0;
    }

    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_port = htons(9996);

    struct Handshake hs = {1, 1, 1};
    if (sendto(s, (char*)&hs, sizeof(hs), 0, (struct sockaddr*)&server, sizeof(server)) == SOCKET_ERROR) {
        closesocket(s);
        s = INVALID_SOCKET;
        WSACleanup();
        return 0;
    }

    return 1;
}

EXPORT int update_telemetry(struct CarTelemetry* out_data) {
    char buffer[1024];
    struct sockaddr_in server;
    int slen = sizeof(server);
    
    int recv_len = recvfrom(s, buffer, sizeof(buffer), 0, (struct sockaddr*)&server, &slen);

    if (recv_len == SOCKET_ERROR) {
        int err = WSAGetLastError();
        if (err == WSAEWOULDBLOCK || err == 10054) {
            return 0; // EN CASO DE NO HABER DATOS NUEVOS
        }
        return -1;
    }

    // Paquete de respuesta al handshake (nombre de coche/circuito): se distingue
    // por tener exactamente el tamano de HandshakerResponse. Lo guardamos aparte
    // y NO lo tratamos como telemetria de coche.
    if (recv_len == (int)sizeof(struct HandshakerResponse)) {
        memcpy(&g_session_info, buffer, sizeof(struct HandshakerResponse));
        g_has_session_info = 1;
        return 0;
    }

    // DESCARTAMOS SOLO PAQUETES MAS PEQUENOS QUE CarTelemetry: evita volcar bytes
    // sin inicializar de `buffer` si llega un paquete truncado. El paquete real
    // de Assetto Corsa (RTCarInfo) trae mas campos despues de "gear" (datos de
    // neumaticos, etc.) que este struct no modela a proposito: es mas grande que
    // sizeof(CarTelemetry) y eso es normal, solo nos quedamos con el prefijo.
    if (recv_len < (int)sizeof(struct CarTelemetry)) {
        return 0;
    }

    // VOLCAMOS LA MEMORIA DE RED A NUESTRO STRUCT
    memcpy(out_data, buffer, sizeof(struct CarTelemetry));

    return 1;
}

// Copia el nombre de coche/circuito de la ultima respuesta de handshake recibida
// a buffers de al menos 100 wchar_t cada uno. Devuelve 1 si hay datos disponibles,
// 0 si Assetto Corsa todavia no ha respondido al handshake.
EXPORT int get_session_info(wchar_t* car_out, wchar_t* track_out) {
    if (!g_has_session_info) {
        return 0;
    }
    memcpy(car_out, g_session_info.carName, sizeof(g_session_info.carName));
    memcpy(track_out, g_session_info.trackName, sizeof(g_session_info.trackName));
    car_out[99] = L'\0';
    track_out[99] = L'\0';
    return 1;
}

EXPORT void close_telemetry() {
    if (s != INVALID_SOCKET) {
        closesocket(s);
        s = INVALID_SOCKET;
    }
    WSACleanup();
}