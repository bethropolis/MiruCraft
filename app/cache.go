package app

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

// ImageResponse contains both the image data and its MIME type
type ImageResponse struct {
	Data     []byte `json:"data"`
	MimeType string `json:"mimeType"`
}

// FetchAndCacheImage uses MakeRequest to fetch an image and caches it
func FetchAndCacheImage(url string) (ImageResponse, error) {
	// Generate a cache directory path
	cacheDir, err := GetCacheDir()
	if err != nil {
		return ImageResponse{}, fmt.Errorf("failed to get cache directory: %w", err)
	}

	// Generate a filename based on the URL
	filename := filepath.Join(cacheDir, fmt.Sprintf("%x", []byte(url)))

	// Check if the image is already cached
	if _, err := os.Stat(filename); err == nil {
		// Read the cached file
		blob, err := os.ReadFile(filename);
		if err != nil {
			return ImageResponse{}, fmt.Errorf("failed to read cached file: %w", err)
		}
		
		// Detect MIME type for cached file
		mimeType := http.DetectContentType(blob)
		
		return ImageResponse{
			Data:     blob,
			MimeType: mimeType,
		}, nil
	}

	// Make a request using MakeRequest
	req := HTTPRequest{
		URL:    url,
		Method: "GET",
		Headers: map[string]string{
			"Cache-Control": "no-cache",
			"User-Agent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
		},
	}
	
	response, err := MakeRequest(req)
	if err != nil {
		return ImageResponse{}, fmt.Errorf("failed to fetch image: %w", err)
	}

	// Check for non-200 status codes
	if response.Status != http.StatusOK {
		return ImageResponse{}, fmt.Errorf("non-200 status code: %d", response.Status)
	}

	// Convert response body to []byte
	blob := []byte(response.Body)

	// Detect MIME type
	mimeType := http.DetectContentType(blob)

	// Save the image to the cache
	err = saveImageToCache(filename, blob)
	if err != nil {
		return ImageResponse{}, fmt.Errorf("failed to save image to cache: %w", err)
	}

	return ImageResponse{
		Data:     blob,
		MimeType: mimeType,
	}, nil
}

func saveImageToCache(filename string, body []byte) error {
	file, err := os.Create(filename)
	if err != nil {
		return fmt.Errorf("failed to create cache file: %w", err)
	}
	defer file.Close()

	_, err = file.Write(body)
	if err != nil {
		return fmt.Errorf("failed to write cache file: %w", err)
	}

	return nil
}

func GetCacheDir() (string, error) {
	cacheDir, err := os.UserCacheDir()
	if err != nil {
		return "", fmt.Errorf("failed to get user cache dir: %w", err)
	}

	appCacheDir := filepath.Join(cacheDir, "Miru test/images/")
	if _, err := os.Stat(appCacheDir); os.IsNotExist(err) {
		err := os.MkdirAll(appCacheDir, 0755)
		if err != nil {
			return "", fmt.Errorf("failed to create cache dir: %w", err)
		}
	}

	return appCacheDir, nil
}