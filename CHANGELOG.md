# 2.3.0
* Ember 3.0 and dep updates

# 2.2.0
* Add `closeFlatpickrDate` test helper

# 2.1.1
* Fix fastboot `flatpickr` undefined issue

# 2.0.2
* Use nextSibling to ensure we disabled the right input

# 2.0.1
* Remove `attributeBinding` for disabled and correctly handle disabling when `altInput=true`
* Remove all jQuery references

# 2.0.0
* Removed `value` and `defaultDate` and instead you now pass a single value `date` which is used for 
the initial `defaultDate` and sets the date on the flatpickr instance when updated.
* Remove all `observers` :tada:
* Remove all the defaults we were maintaining and just pass everything straight to flatpickr with `this.attrs`
