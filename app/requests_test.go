package app

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestMakeRequest(t *testing.T) {
    // Create a mock server
    mockServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(`{"message": "success"}`))
    }))
    defer mockServer.Close()

    url := mockServer.URL

    // fmt.Printf("Mock server URL: %s\n", url)

    // Create a sample HTTPRequest
    req := HTTPRequest{
        URL:    url,
        Method: "GET",
        Headers: map[string]string{
            "Accept": "application/json",
        },
        Body: "",
    }

    // Call the MakeRequest function
    resp, err := MakeRequest(req)
    if err != nil {
        t.Fatalf("Expected no error, got %v", err)
    }

    // Check the response status
    if resp.Status != http.StatusOK {
        t.Errorf("Expected status %d, got %d", http.StatusOK, resp.Status)
    }

    // Check the response body
    expectedBody := `{"message": "success"}`
    if resp.Body != expectedBody {
        t.Errorf("Expected body %s, got %s", expectedBody, resp.Body)
    }

    // Check the response headers
    if resp.Headers["Content-Type"] != "application/json" {
        t.Errorf("Expected Content-Type application/json, got %s", resp.Headers["Content-Type"])
    }
}