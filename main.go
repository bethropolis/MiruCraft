package main

import (
	"embed"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/linux"

	appconfig "MiruCraft/app"
)

//go:embed build/appicon.png
var iconBytes []byte

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	app := NewApp()

	err := wails.Run(&options.App{
		Title:      appconfig.APP_INFO["name"],
		Width:      1024,
		Height:     768,
		MinWidth:   640,
		MinHeight:  400,
		MaxWidth:   4000,
		MaxHeight:  2048,
		Fullscreen: true,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
		Linux: &linux.Options{
			Icon:        iconBytes,
			ProgramName: appconfig.APP_INFO["name"],
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
