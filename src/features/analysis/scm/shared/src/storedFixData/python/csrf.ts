export const csrf = {
  guidance:
    () => `Please make sure the CSRF middleware is activated by default in the MIDDLEWARE setting. If you override that setting, remember that \`django.middleware.csrf.CsrfViewMiddleware\` should come before any view middleware that assume that CSRF attacks have been dealt with.


If you disabled it, which is not recommended, you can use [\`csrf_protect()\`](https://docs.djangoproject.com/en/5.1/ref/csrf/#django.views.decorators.csrf.csrf_protect) annotation on this particular view.


See more information [here](https://docs.djangoproject.com/en/5.1/howto/csrf/).`,
}
