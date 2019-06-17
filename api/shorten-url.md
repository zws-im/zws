---
description: Shorten a long URL
---

# Shorten URL

{% api-method method="get" host="https://us-central1-zero-width-shortener.cloudfunctions.net" path="/shortenURL" %}
{% api-method-summary %}
Shorten URL
{% endapi-method-summary %}

{% api-method-description %}
This endpoint returns the short ID corresponding to the specified long URL.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-query-parameters %}
{% api-method-parameter name="url" type="string" required=true %}
The long URL to shorten. Must not contain the URL shortener's hostname or exceed 500 characters in length.
{% endapi-method-parameter %}
{% endapi-method-query-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
The URL has already been shortened and was fetched from the database.
{% endapi-method-response-example-description %}

```javascript
{
    "short": "Short ID"
}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=201 %}
{% api-method-response-example-description %}
The URL was shortened and added to the database.
{% endapi-method-response-example-description %}

```javascript
{
    "short": "Short ID"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



