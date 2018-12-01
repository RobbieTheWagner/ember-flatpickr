
import Mixin from "@ember/object/mixin";
import { assert } from "@ember/debug";
import { assign } from "@ember/polyfills";
import { on } from "@ember/object/evented";
import { run } from "@ember/runloop";
import { getOwner } from "@ember/application";
import diffAttrs from 'ember-diff-attrs';

export default Mixin.create({  
  date: null,
  flatpickrRef: null,

  setupComponent() {
    // Require that users pass a date
    assert(
      "{{ember-flatpickr}} requires a `date` to be passed as the value for flatpickr.",
      this.get("date") !== undefined
    );

    // Require that users pass an onChange
    assert(
      "{{ember-flatpickr}} requires an `onChange` action or null for no action.",
      this.get("onChange") !== undefined
    );

    // Pass all values and setup flatpickr
    run.scheduleOnce("afterRender", this, function() {
      const fastboot = getOwner(this).lookup("service:fastboot");
      if (fastboot && fastboot.isFastBoot) {
        return;
      }
      const options = this.getProperties(Object.keys(this.attrs));

      // Add defaultDate, change and close handlers
      assign(options, {
        defaultDate: this.get("date"),
        onChange: this._onChange.bind(this),
        onClose: this._onClose.bind(this),
        onOpen: this._onOpen.bind(this),
        onReady: this._onReady.bind(this)
      });

      const flatpickrRef = flatpickr(this.field, options);

      if (this.get("appendDataInput")) {
        this.element.setAttribute("data-input", "");
      }

      this._setDisabled(this.get("disabled"));

      this.set("flatpickrRef", flatpickrRef);
    });
  },

  didReceiveAttrs: diffAttrs(
    "altFormat",
    "date",
    "disabled",
    "locale",
    "maxDate",
    "minDate",
    function(changedAttrs, ...args) {
      this._super(...args);

      this._attributeHasChanged(changedAttrs, "altFormat", newAltFormat => {
        this.element._flatpickr.set("altFormat", newAltFormat);
      });

      this._attributeHasChanged(changedAttrs, "date", newDate => {
        if (typeof newDate !== "undefined") {
          this.element._flatpickr.setDate(newDate);
        }
      });

      this._attributeHasChanged(changedAttrs, "disabled", newDisabled => {
        if (typeof newDisabled !== "undefined") {
          this._setDisabled(newDisabled);
        }
      });

      this._attributeHasChanged(changedAttrs, "locale", () => {
        this.element._flatpickr.destroy();
        this.setupComponent();
      });

      this._attributeHasChanged(changedAttrs, "maxDate", newMaxDate => {
        this.element._flatpickr.set("maxDate", newMaxDate);
      });

      this._attributeHasChanged(changedAttrs, "minDate", newMinDate => {
        this.element._flatpickr.set("minDate", newMinDate);
      });
    }
  ),

  willDestroyElement() {
    this.element._flatpickr.destroy();
  },

  
  _attributeHasChanged(changedAttrs, attr, callback) {
    if (changedAttrs && changedAttrs[attr]) {
      const [oldAttr, newAttr] = changedAttrs[attr];
      if (oldAttr !== newAttr) {
        callback(newAttr);
      }
    }
  },

  
  onClose(/*selectedDates, dateStr, instance*/) {},

  
  onOpen(/*selectedDates, dateStr, instance*/) {},

 
  onReady(/*selectedDates, dateStr, instance*/) {},

  
  _onChange(selectedDates, dateStr, instance) {
    if (this.onChange instanceof Function) {
      this.onChange(selectedDates, dateStr, instance);
    }
  },

  
  _onClose(selectedDates, dateStr, instance) {
    this.onClose(selectedDates, dateStr, instance);
  },

  
  _onOpen(selectedDates, dateStr, instance) {
    this.onOpen(selectedDates, dateStr, instance);
  },

  
  _onReady(selectedDates, dateStr, instance) {
    this.onReady(selectedDates, dateStr, instance);
  },

  
  _setDisabled(disabled) {
    if (this.get("altInput")) {
      this.element.nextSibling.disabled = disabled;
    } else {
      this.element.disabled = disabled;
    }
  }
});
