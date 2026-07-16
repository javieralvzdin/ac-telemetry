#include <stdio.h>
#include <stdlib.h>
#include <winsock2.h>
#include <windows.h>

#define EXPORT __declspec(dllexport)

SOCKET s;

struct Handshake {
    int identifier;
    int version;
    int operationId;
};

struct CarTelemetry {
    int identifier;
    int size;
    float speed_kmh;
    float speed_mph;
    float speed_ms;
};

EXPORT void init_telemetry() {
    WSADATA wsa;
    struct sockaddr_in server;
    
    WSAStartup(MAKEWORD(2,2), &wsa);
    s = socket(AF_INET, SOCK_DGRAM, 0);
    
    // --- NUEVO: Hacer el socket NO bloqueante ---
    u_long mode = 1;
    ioctlsocket(s, FIONBIO, &mode);
    // -------------------------------------------
    
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_port = htons(9996);
    
    struct Handshake hs = {1, 1, 1}; 
    sendto(s, (char*)&hs, sizeof(hs), 0, (struct sockaddr*)&server, sizeof(server));
}

// Cambiamos a int para devolver el estado a Python
EXPORT int update_telemetry(struct CarTelemetry* out_data) {
    char buffer[1024];
    struct sockaddr_in server;
    int slen = sizeof(server);
    
    int recv_len = recvfrom(s, buffer, sizeof(buffer), 0, (struct sockaddr*)&server, &slen);
    
    if (recv_len == SOCKET_ERROR) {
        int err = WSAGetLastError();
        // WSAEWOULDBLOCK (10035) significa "No hay datos en este exacto milisegundo"
        if (err == WSAEWOULDBLOCK || err == 10054) {
            return 0; // Devolvemos el control a Python sin datos
        }
        return -1; // Error real
    }
    
    struct CarTelemetry* incoming = (struct CarTelemetry*)buffer;
    
    out_data->identifier = incoming->identifier;
    out_data->size = incoming->size;
    out_data->speed_kmh = incoming->speed_kmh;
    out_data->speed_mph = incoming->speed_mph;
    out_data->speed_ms = incoming->speed_ms;
    
    return 1; // Éxito, hay datos nuevos
}

EXPORT void close_telemetry() {
    closesocket(s);
    WSACleanup();
}