# ember-flatpickr

## Date/Time Picker

{{#docs-demo as |demo|}}
  {{#demo.example name="date-time-picker.hbs"}}
    {{ember-flatpickr
      allowInput=true
      appendDataInput=true
      classNames=classString
      date=(readonly dateValue)
      enableTime=true
      locale=locale
      minDate=minDate
      onClose=(action "onClose")
      onChange=(action (mut dateValue))
      onReady=(action "onReady")
      placeholder="Pick date"
    }}
  {{/demo.example}}
  
  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{dateValue}}
    </p>
    
    <h2>Options</h2>
    
    <PowerSelect
      @matchTriggerWidth={{false}}
      @options={{locales}}
      @placeholder="Choose a Locale"
      @searchEnabled={{false}}
      @selected={{locale}}
      @triggerClass={{classString}}
      @onchange={{action (mut locale)}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{action "updateMin"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Set minDate to '2080-12-24T16:16:22.585Z'</button>
    <button {{action "clearDate"}} class="docs-btn docs-mt-2 docs-p-2">Clear date</button>
  </div>
  
  {{demo.snippet "date-time-picker.hbs"}}
{{/docs-demo}}

## Range Date/Time Picker

{{#docs-demo as |demo|}}
  {{#demo.example name="range-date-time-picker.hbs"}}
    {{ember-flatpickr
      allowInput=true
      appendDataInput=true
      classNames=classString
      date=(readonly dateRangeValue)
      enableTime=true
      locale=locale
      mode="range"
      minDate=minDate
      onClose=(action "onClose")
      onChange=(action (mut dateRangeValue))
      onReady=(action "onReady")
      placeholder="Pick dates"
    }}
  {{/demo.example}}
  
  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{dateRangeValue}}
    </p>
    
    <h2>Options</h2>
    
    <PowerSelect
      @matchTriggerWidth={{false}}
      @options={{locales}}
      @placeholder="Choose a Locale"
      @searchEnabled={{false}}
      @selected={{locale}}
      @triggerClass={{classString}}
      @onchange={{action (mut locale)}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{action "updateMin"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Set minDate to '2080-12-24T16:16:22.585Z'</button>
    <button {{action "clearDate"}} class="docs-btn docs-mt-2 docs-p-2">Clear date</button>
  </div>
  
  {{demo.snippet "range-date-time-picker.hbs"}}
{{/docs-demo}}

## Time Picker

{{#docs-demo as |demo|}}
  {{#demo.example name="time-picker.hbs"}}
    {{ember-flatpickr
      appendDataInput=true
      classNames=classString
      date=(readonly timeValue)
      enableTime=true
      locale=locale
      minDate=minDate
      noCalendar=true
      onClose=(action "onCloseTime")
      onChange=(action (mut timeValue))
      onReady=(action "onReadyTime")
      placeholder="Pick time"
    }}
  {{/demo.example}}
  
  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{timeValue}}
    </p>
    
    <h2>Options</h2>
    
    <button {{action "clearTime"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Clear time</button>
  </div>
 
  {{demo.snippet "time-picker.hbs"}}
{{/docs-demo}}
