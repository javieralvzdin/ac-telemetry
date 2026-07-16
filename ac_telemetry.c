#include <stdio.h>
#include <stdlib.h>
#include <winsock2.h>

// gcc -shared -o ac_telemetry.dll ac_telemetry.c -lws2_32

#define EXPORT __declspec(dllexport)

struct Handshake {
    int identifier;
    int version;
    int operationId;
};

// Mantenemos la estructura pequeña, solo nos interesa leer el principio de la memoria
struct CarTelemetry {
    int identifier;
    int size;
    float speed_kmh;
    float speed_mph;
    float speed_ms;
};

EXPORT void init_telemetry() {
    WSADATA wsa;
    SOCKET s;
    struct sockaddr_in server;
    
    printf("[C-CORE] Starting network system...\n");
    if (WSAStartup(MAKEWORD(2,2), &wsa) != 0) return;
    
    if((s = socket(AF_INET, SOCK_DGRAM, 0)) == INVALID_SOCKET) return;
    
    server.sin_family = AF_INET;
    server.sin_addr.s_addr = inet_addr("127.0.0.1");
    server.sin_port = htons(9996);
    
    // CAMBIO 1: operationId = 1 (Start UDP Telemetry Stream)
    struct Handshake hs = {1, 1, 1};
    
    printf("[C-CORE] Sending Handshake (UPDATE) to Assetto Corsa...\n");
    sendto(s, (char*)&hs, sizeof(hs), 0, (struct sockaddr*)&server, sizeof(server));
    
    // CAMBIO 2: Un buffer gigante para que quepa todo el paquete del juego
    char buffer[1024];
    int slen = sizeof(server);
    printf("[C-CORE] Listening for telemetry data...\n");
    
    // CAMBIO 3: Bucle para ignorar el falso error 10054 de Windows
    while (1) {
        int recv_len = recvfrom(s, buffer, sizeof(buffer), 0, (struct sockaddr*)&server, &slen);
        
        if (recv_len == SOCKET_ERROR) {
            int err = WSAGetLastError();
            if (err == 10054) {
                // Windows UDP quirk. Lo ignoramos y volvemos a escuchar al instante.
                continue; 
            }
            printf("[C-CORE] recvfrom() failed. Error: %d\n", err);
            break;
        }
        
        // Si hay datos, encajamos la memoria bruta (buffer) en nuestro struct
        struct CarTelemetry* data = (struct CarTelemetry*)buffer;
        
        printf("[C-CORE] SUCCESS! Packet received (%d bytes).\n", recv_len);
        printf("[C-CORE] Speed: %.2f km/h\n", data->speed_kmh);
        break; // Rompemos el bucle porque ya hemos leído el primer paquete con éxito
    }
    
    closesocket(s);
    WSACleanup();
}