package app

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"
	"math"
)

// HTTPResponse represents the structure we'll return to the frontend
type HTTPResponse struct {
    Status  int               `json:"status"`
    Body    string            `json:"body"`
    Headers map[string]string `json:"headers"` // Modified to map[string]string
    Error   string            `json:"error,omitempty"`
    Duration string            `json:"duration,omitempty"` // Add duration field
}

// HTTPRequest represents the request structure coming from frontend
type HTTPRequest struct {
    URL     string            `json:"url"`
    Method  string            `json:"method"`
    Headers map[string]string `json:"headers"`
    Body    string            `json:"body"`
}

// MakeRequest takes an HTTPRequest and makes the HTTP request
func MakeRequest(req HTTPRequest) (HTTPResponse, error) {
    client := &http.Client{Timeout: 10 * time.Second} // Timeout of 10 seconds

    // Record the start time
    startTime := time.Now()

    // Create a new HTTP request
    httpReq, err := http.NewRequest(req.Method, req.URL, bytes.NewBuffer([]byte(req.Body)))
    if err != nil {
        return HTTPResponse{Error: err.Error()}, err
    }

    // Add headers to the request
    for key, value := range req.Headers {
        httpReq.Header.Set(key, value)
        log.Println("Header added: ", key, value)
    }

    // Make the request
    resp, err := client.Do(httpReq)
    if err != nil {
        return HTTPResponse{Error: err.Error()}, err
    }
    defer resp.Body.Close()

    // Record the end time
    endTime := time.Now()
    duration := endTime.Sub(startTime)

    // Read the response body
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return HTTPResponse{Error: err.Error()}, err
    }

    // Round the duration to the nearest two decimal places
    roundedDuration := math.Round(duration.Seconds()*100) / 100
    durationString := fmt.Sprintf("%.2fs", roundedDuration)

    // Simplify headers to map[string]string
    simpleHeaders := make(map[string]string)
    for key, values := range resp.Header {
        simpleHeaders[key] = strings.Join(values, ", ") // Join multiple values with comma
    }

    // Prepare the response
    response := HTTPResponse{
        Status:  resp.StatusCode,
        Body:    string(body),
        Headers: simpleHeaders, // Use the simplified headers
        Duration: durationString, // Add the rounded duration to the response
    }

    log.Printf("Request to %s returned status %d in %s", req.URL, resp.StatusCode, durationString)

    return response, nil
}