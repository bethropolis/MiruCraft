package app

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"
	"math"
	"encoding/json" // Import json package
)

// HTTPResponse represents the structure we'll return to the frontend
type HTTPResponse struct {
	Status  int               `json:"status"`
	Body    string            `json:"body"`
	Headers map[string]string `json:"headers"`
	Error   string            `json:"error,omitempty"`
	Duration string          `json:"duration,omitempty"`
}

// HTTPRequest represents the request structure coming from frontend
type HTTPRequest struct {
	URL     string            `json:"url"`
	Method  string            `json:"method"`
	Headers map[string]string `json:"headers"`
	Body    interface{}       `json:"body"` // Body can be an object
}

// MakeRequest takes an HTTPRequest and makes the HTTP request
func MakeRequest(req HTTPRequest) (HTTPResponse, error) {
	client := &http.Client{Timeout: 10 * time.Second}

	startTime := time.Now()

	var requestBodyReader io.Reader
	contentType := "" // To track content type if provided

	if req.Headers != nil {
		contentType = req.Headers["Content-Type"]
	}

	// Format body based on Content-Type only if it's provided
	if contentType == "application/x-www-form-urlencoded" {
		// Form-urlencoded body encoding
		formData := url.Values{}
		if bodyMap, ok := req.Body.(map[string]interface{}); ok {
			for key, value := range bodyMap {
				formData.Set(key, fmt.Sprintf("%v", value))
			}
		} else if bodyMapStr, ok := req.Body.(map[string]string); ok {
			for key, value := range bodyMapStr {
				formData.Set(key, value)
			}
		} else if req.Body != nil { // Handle non-nil body for form-urlencoded but not a map as error
			return HTTPResponse{Error: "Invalid body format for application/x-www-form-urlencoded. Expected map."}, fmt.Errorf("invalid body format for form-urlencoded")
		}
		requestBodyReader = strings.NewReader(formData.Encode())

	} else if contentType == "application/json" { 
		requestBodyBytes, err := json.Marshal(req.Body)
		if err != nil {
			return HTTPResponse{Error: err.Error()}, err
		}
		requestBodyReader = bytes.NewBuffer(requestBodyBytes)

	} else {
		if req.Body != nil {
			bodyString := fmt.Sprintf("%v", req.Body) // Try to convert body to string representation
			requestBodyReader = strings.NewReader(bodyString)
		}
	}

	// Create a new HTTP request
	httpReq, err := http.NewRequest(req.Method, req.URL, requestBodyReader)
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

	endTime := time.Now()
	duration := endTime.Sub(startTime)

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return HTTPResponse{Error: err.Error()}, err
	}

	roundedDuration := math.Round(duration.Seconds()*100) / 100
	durationString := fmt.Sprintf("%.2fs", roundedDuration)

	simpleHeaders := make(map[string]string)
	for key, values := range resp.Header {
		simpleHeaders[key] = strings.Join(values, ", ")
	}

	response := HTTPResponse{
		Status:   resp.StatusCode,
		Body:     string(bodyBytes),
		Headers:  simpleHeaders,
		Duration: durationString,
	}

	log.Printf("%s Request to %s returned status %d in %s", req.Method, req.URL, resp.StatusCode, durationString)

	return response, nil
}