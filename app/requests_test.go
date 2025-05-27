package app

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"
)

func TestMakeRequest_GET(t *testing.T) {
	// Define the handler for the mock server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			t.Errorf("Expected GET request, got %s", r.Method)
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		if r.URL.Path != "/user" {
			t.Errorf("Expected request to /user, got %s", r.URL.Path)
			w.WriteHeader(http.StatusNotFound)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"name": "Test User", "email": "test@example.com", "address": "123 Test St"}`))
	})

	// Create a mock server using the handler
	mockServer := httptest.NewServer(handler)
	defer mockServer.Close()

	serverURL := mockServer.URL + "/user" // Target the /user endpoint

	// Create a sample HTTPRequest for GET /user
	req := HTTPRequest{
		URL:    serverURL,
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
	expectedBody := `{"name": "Test User", "email": "test@example.com", "address": "123 Test St"}`
	if resp.Body != expectedBody {
		t.Errorf("Expected body '%s', got '%s'", expectedBody, resp.Body) // use single quotes for better readability in errors
	}

	// Check the response headers
	if resp.Headers["Content-Type"] != "application/json" {
		t.Errorf("Expected Content-Type application/json, got %s", resp.Headers["Content-Type"])
	}
}

func TestMakeRequest_POST(t *testing.T) {
	// Define the handler for the mock server
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("Expected POST request, got %s", r.Method)
			w.WriteHeader(http.StatusMethodNotAllowed)
			return
		}
		if r.URL.Path != "/echo" {
			t.Errorf("Expected request to /echo, got %s", r.URL.Path)
			w.WriteHeader(http.StatusNotFound)
			return
		}

		// Decode the request body
		var requestBody map[string]interface{}
		err := json.NewDecoder(r.Body).Decode(&requestBody)
		if err != nil {
			t.Fatalf("Failed to decode request body: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		responseBody := map[string]interface{}{
			"received": requestBody,
			"fakeId":   "test-uuid-123", // static fakeId for test
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(responseBody) // Encode and write the JSON response
	})

	// Create a mock server using the handler
	mockServer := httptest.NewServer(handler)
	defer mockServer.Close()

	serverURL := mockServer.URL + "/echo" // Target the /echo endpoint

	// Create a sample HTTPRequest for POST /echo
	requestBody := map[string]string{
		"key1": "value1",
		"key2": "value2",
	}
	requestBodyBytes, _ := json.Marshal(requestBody) // error is ignored for simplicity in test

	req := HTTPRequest{
		URL:    serverURL,
		Method: "POST",
		Headers: map[string]string{
			"Content-Type": "application/json", // Sending JSON body
			"Accept":       "application/json",
		},
		Body: string(requestBodyBytes),
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

	// Check the response body - unmarshal to compare as objects
	var actualResponseBody map[string]interface{}
	var expectedResponseBody map[string]interface{}

	err = json.Unmarshal([]byte(resp.Body), &actualResponseBody)
	if err != nil {
		t.Fatalf("Failed to unmarshal response body: %v, body: %s", err, resp.Body)
	}

	expectedReceived := make(map[string]interface{})
	for k, v := range requestBody {
		expectedReceived[k] = v
	}
	expectedResponseBody = map[string]interface{}{
		"received": expectedReceived,
		"fakeId":   "test-uuid-123", // static fakeId to match mock server
	}

	// Compare the unmarshaled bodies
	if actualResponseBody["received"].(map[string]interface{})["key1"] != expectedResponseBody["received"].(map[string]interface{})["key1"] ||
		actualResponseBody["received"].(map[string]interface{})["key2"] != expectedResponseBody["received"].(map[string]interface{})["key2"] ||
		actualResponseBody["fakeId"] != expectedResponseBody["fakeId"] {
		t.Errorf("Response body does not match.\nExpected body: %+v\nGot body: %+v", expectedResponseBody, actualResponseBody)
	}

	// Check the response headers
	if resp.Headers["Content-Type"] != "application/json" {
		t.Errorf("Expected Content-Type application/json, got %s", resp.Headers["Content-Type"])
	}
}

func TestMakeRequest_POST_Weebcentral(t *testing.T) {
	weebcentralURL := "https://weebcentral.com/search/simple"
	searchKeyword := "show"

	// Format the body for application/x-www-form-urlencoded
	formData := url.Values{}
	formData.Set("text", searchKeyword)
	body := formData.Encode() // text=keyword

	req := HTTPRequest{
		URL:    weebcentralURL,
		Method: "POST",
		Headers: map[string]string{
			"Content-Type": "application/x-www-form-urlencoded",
		},
		Body: body,
	}

	resp, err := MakeRequest(req)
	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}

	// Basic checks - you might want to add more specific checks based on weebcentral's expected response
	if resp.Status != http.StatusOK { // Assuming 200 OK is expected for a successful search
		t.Errorf("Expected status %d for weebcentral search, got %d", http.StatusOK, resp.Status)
	}

	// Log body and headers for manual inspection - since the content of weebcentral can change
	t.Logf("Weebcentral Response Status: %d", resp.Status)
	t.Logf("Weebcentral Response Headers: %+v", resp.Headers)
	t.Logf("Weebcentral Response Body (truncated - first 500 chars): %s...", truncateString(resp.Body, 500))

	fmt.Printf(resp.Body)
}

// Helper function to truncate string for logging
func truncateString(s string, maxLen int) string {
	if len(s) > maxLen {
		return s[:maxLen]
	}
	return s
}
