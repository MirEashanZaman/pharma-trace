#include <WiFi.h>
#include <HTTPClient.h>
#include "DHTesp.h"

const int DHT_PIN = 15;
DHTesp dht;

// PharmaTrace Constants
const float MIN_TEMP = 2.0;
const float MAX_TEMP = 8.0;
const String DRUG_SERIAL = "DRUG-001";
const float LATITUDE = 23.8103;
const float LONGITUDE = 90.4125;

// Wi-Fi & API Configuration
const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASSWORD = "";

const String SERVER_IP = "10.156.198.225";
String targetUrl = "http://" + SERVER_IP + ":3500/iot/sensor/" + DRUG_SERIAL;

void setup()
{
  Serial.begin(115200);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  Serial.println("Connecting to Wi-Fi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWi-Fi Connected!");
  Serial.println("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.println("PharmaTrace-ES IoT Simulation Started");
  Serial.println("Target URL: " + targetUrl);
  Serial.println("-------------------------");
}

void loop()
{
  TempAndHumidity data = dht.getTempAndHumidity();

  // Create structured JSON payload
  String jsonPayload = "{";
  jsonPayload += "\"temperature\": " + String(data.temperature, 2) + ", ";
  jsonPayload += "\"humidity\": " + String(data.humidity, 2) + ", ";
  jsonPayload += "\"latitude\": " + String(LATITUDE, 4) + ", ";
  jsonPayload += "\"longitude\": " + String(LONGITUDE, 4);
  jsonPayload += "}";

  Serial.println("Generated Payload: " + jsonPayload);

  // Send HTTP POST request
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(targetUrl); // SERVER_URL পরিবর্তন করে targetUrl করা হয়েছে
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0)
    {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String responseBody = http.getString();
      Serial.println("Server Response: " + responseBody);
    }
    else
    {
      Serial.print("HTTP Post failed. Error code: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  }
  else
  {
    Serial.println("Wi-Fi Disconnected");
  }

  // Threshold Validation
  if (data.temperature < MIN_TEMP || data.temperature > MAX_TEMP)
  {
    Serial.println("⚠️ ALERT: Temperature threshold exceeded!");
  }

  Serial.println("-------------------------");
  delay(10000); // 10-second interval between sending data
}