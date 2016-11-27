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
        url(r'^scrumboard/',include('django_scrumboard.urls')),
        ...
    ]

Features
--------

TODO

* Add delete validation with id, title (prevent deleting other task due to offline != server tasks)
* Remove CSRF token from saved tasks
* Add configs
* Add wrong form alerts
* Add alerts about offline, tasks read/created/updated/deleted online/offline
* Save created tasks offline
* Fix delete/update syncronisation between offline/online
* Add permission checks
* Use django template engine instead of handlebars (?)
* Show user when he is offline/online
* Add service worker

Running Tests
-------------

I'm not the tests guy, I can't get myself to write them.
Maybe later i will write some - now they are useless. You can still try to launch them - no promises.


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
