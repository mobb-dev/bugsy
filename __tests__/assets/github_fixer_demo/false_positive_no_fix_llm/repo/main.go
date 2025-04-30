package main

import (
	"fmt"
    "strings"
	"log"
	"net/http"
)

func serve() {
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		r.ParseForm()
		user := r.Form.Get("user")

		log.Printf("Register user: %v\n", strings.ReplaceAll(strings.ReplaceAll(fmt.Sprintf("%v", user), "\n", "-"), "\r", "-"))
	})
	http.ListenAndServe(":80", nil)
}

func main() {
}
