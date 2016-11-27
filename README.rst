=============================
django-scrumboard
=============================

.. image:: https://badge.fury.io/py/django-scrumboard.png
    :target: https://badge.fury.io/py/django-scrumboard

.. image:: https://travis-ci.org/delneg/django-scrumboard.png?branch=master
    :target: https://travis-ci.org/delneg/django-scrumboard

A small and easy-to-use application for intergrating SCRUM in your Django life
Built upon https://github.com/i-break-codes/scrum-board
Documentation
-------------

The full documentation is at https://django-scrumboard.readthedocs.io.

Quickstart
----------

Install django-scrumboard::

    pip install django-scrumboard

Add it to your `INSTALLED_APPS`:

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

Features
--------

* TODO

Running Tests
-------------

Does the code actually work?

::

    source <YOURVIRTUALENV>/bin/activate
    (myenv) $ pip install tox
    (myenv) $ tox

Credits
-------

Tools used in rendering this package:

*  Cookiecutter_
*  `cookiecutter-djangopackage`_

.. _Cookiecutter: https://github.com/audreyr/cookiecutter
.. _`cookiecutter-djangopackage`: https://github.com/pydanny/cookiecutter-djangopackage
