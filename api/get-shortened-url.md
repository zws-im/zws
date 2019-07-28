---
description: Redirect to the long URL from a shortened URL
---

# Get URL

{% api-method method="get" host="https://us-central1-zero-width-shortener.cloudfunctions.net" path="/getURL/:short" %}
{% api-method-summary %}
Get URL
{% endapi-method-summary %}

{% api-method-description %}
This endpoint redirects you to the long URL corresponding to a short ID.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="short" type="string" required=true %}
Short ID of the URL to redirect to.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=301 %}
{% api-method-response-example-description %}
Redirects you to the long URL corresponding to the provided short ID.
{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=400 %}
{% api-method-response-example-description %}
The short ID wasn't specified or wasn't a string type.
{% endapi-method-response-example-description %}

{% code-tabs %}
{% code-tabs-item title="no short ID" %}
```javascript
{
    "error": "You must specify a short ID"
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="invalid ID type" %}
```javascript
{
    "error": "Short ID must be string type"
}
```
{% endcode-tabs-item %}

{% code-tabs-item title="invalid characters in short ID" %}
```javascript
{
    "error": "Short ID contained invalid characters"
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}
{% endapi-method-response-example %}

{% api-method-response-example httpCode=404 %}
{% api-method-response-example-description %}
The requested short ID couldn't be found.
{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



