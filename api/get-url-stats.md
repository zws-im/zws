---
description: Get usage stats for a URL
---

# Get URL stats

{% api-method method="get" host="https://us-central1-zero-width-shortener.cloudfunctions.net" path="/:short" %}
{% api-method-summary %}
Get URL Stats
{% endapi-method-summary %}

{% api-method-description %}
This endpoint allows you to see stats for a URL that was shortened.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="short" type="string" %}
Short ID of the URL to get stats for.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-query-parameters %}
{% api-method-parameter type="string" name="short" %}
Short ID of the URL to get stats for.
{% endapi-method-parameter %}

{% api-method-parameter name="url" type="string" %}
Long URL to get stats for.
{% endapi-method-parameter %}
{% endapi-method-query-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
`get` is the number of times the shortened URL was visited and `shorten` is the number of times it was shortened.
{% endapi-method-response-example-description %}

```javascript
{
    "get": 123,
    "shorten": 123
}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=400 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

{% code-tabs %}
{% code-tabs-item title="URL was not specified" %}
```javascript
{
    "error": "You must specify a short ID or a URL"
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="invalid URL type" %}
```javascript
{
    "error": "URL must be string type"
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="invalid short ID type" %}
```javascript
{
    "error": "Short ID must be string type"
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="URL is invalid" %}
```javascript
{
    "error": "Not a valid URL"
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
{% endapi-method-response-example %}

{% api-method-response-example httpCode=404 %}
{% api-method-response-example-description %}
The URL or short ID couldn't be found.
{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=413 %}
{% api-method-response-example-description %}
The URL exceed 500 characters.
{% endapi-method-response-example-description %}

```javascript
{
    "error": "URL can not exceed 500 characters"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

