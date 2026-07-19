#include <stdio.h>
#include <stdlib.h>
#include <string.h> // Necesario para memcpy
#include <winsock2.h>
#include <windows.h>

#define EXPORT __declspec(dllexport)

SOCKET s;

struct Handshake {
    int identifier;
    int version;
    int operationId;
};

// Forzamos alineación de 1 byte para leer el paquete de red exactamente como llega
#pragma pack(push, 1) 
struct CarTelemetry {
    int identifier;
    int size;
    float speed_kmh;
    float speed_mph;
    float speed_ms;
    char isAbsEnabled;
    char isAbsInAction;
    char isTcInAction;
    char isTcEnabled;
    char inPit;
    char engineLimiterOn;
    char padding[2]; // Padding para alinear los siguientes floats
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
#pragma pack(pop)

EXPORT void init_telemetry() {
    WSADATA wsa;
    struct sockaddr_in server;
    
    WSAStartup(MAKEWORD(2,2), &wsa);
    s = socket(AF_INET, SOCK_DGRAM, 0);
    
    u_long mode = 1;
    ioctlsocket(s, FIONBIO, &mode);
    
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_port = htons(9996);
    
    struct Handshake hs = {1, 1, 1}; 
    sendto(s, (char*)&hs, sizeof(hs), 0, (struct sockaddr*)&server, sizeof(server));
}

EXPORT int update_telemetry(struct CarTelemetry* out_data) {
    char buffer[1024];
    struct sockaddr_in server;
    int slen = sizeof(server);
    
    int recv_len = recvfrom(s, buffer, sizeof(buffer), 0, (struct sockaddr*)&server, &slen);
    
    if (recv_len == SOCKET_ERROR) {
        int err = WSAGetLastError();
        if (err == WSAEWOULDBLOCK || err == 10054) {
            return 0; // Sin datos nuevos
        }
        return -1; // Error real
    }
    
    // Volcamos la memoria de red directamente en nuestro struct (Copia súper rápida)
    memcpy(out_data, buffer, sizeof(struct CarTelemetry));
    
    return 1; // Éxito
}

EXPORT void close_telemetry() {
    closesocket(s);
    WSACleanup();
}