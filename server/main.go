package main

import (
	"net/http"

	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
)

// connected clients
var counter = 0
var clients = make(map[*websocket.Conn]int)

// Configure the upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type message struct {
	ClientID int `json:"id"`
	PosX     int `json:"px"`
	PosY     int `json:"py"`
}

func main() {
	log.Info("Starting server...")

	// Create a simple file server
	fs := http.FileServer(http.Dir("."))
	http.Handle("/", fs)

	// Configure websocket route
	http.HandleFunc("/ws", handleConnections)

	// Start the server on localhost port 8000 and log any errors
	log.Info("Server started on :8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	// Upgrade initial GET request to a websocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Make sure we close the connection when the function returns
	defer ws.Close()

	// Register our new client
	counter++
	clients[ws] = counter

	for {
		var msg message
		// Read in a new message as JSON and map it to a Message object
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Errorf("error: %v", err)
			delete(clients, ws)
			break
		}
		log.Infof("Update from client #%v (%v, %v)", msg.ClientID, msg.PosX, msg.PosY)
	}
}
