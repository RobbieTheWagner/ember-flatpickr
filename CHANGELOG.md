# 2.0.1
* Remove `attributeBinding` for disabled and correctly handle disabling when `altInput=true`
* Remove all jQuery references

# 2.0.0
* Removed `value` and `defaultDate` and instead you now pass a single value `date` which is used for 
the initial `defaultDate` and sets the date on the flatpickr instance when updated.
* Remove all `observers` :tada:
* Remove all the defaults we were maintaining and just pass everything straight to flatpickr with `this.attrs`
