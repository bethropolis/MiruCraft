package main

import (
    "context"
    "MiruCraft/app" // Import the requests package
)

// App struct
type App struct {
    ctx context.Context
}


// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}


// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}


// MakeHTTPRequest is a Wails function that calls the MakeRequest method from requests.go
func (a *App) Request(req app.HTTPRequest) (app.HTTPResponse, error) {
    return app.MakeRequest(req)
}

func (a *App) FetchImage(url string)  (app.ImageResponse, error) {
    return app.FetchAndCacheImage(url);
}