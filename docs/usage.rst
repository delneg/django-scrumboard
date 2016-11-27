=====
Usage
=====

To use django-scrumboard in a project, add it to your `INSTALLED_APPS`:

.. code-block:: python

    INSTALLED_APPS = (
        ...
        'django_scrumboard',
        ...
    )

Add django-scrumboard's URL patterns:

.. code-block:: python

    from django_scrumboard import urls as django_scrumboard_urls


    urlpatterns = [
        ...
        url(r'^', include(django_scrumboard_urls)),
        ...
    ]
