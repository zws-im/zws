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
Short ID of the URL to redirect to. Optionally you may append a `Z` to the end to help mark the end of the URL.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}

{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=302 %}
{% api-method-response-example-description %}
Redirects you to the long URL corresponding to the provided short ID.
{% endapi-method-response-example-description %}

```

```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



