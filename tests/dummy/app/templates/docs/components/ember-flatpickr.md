# ember-flatpickr

## Date/Time Picker

<DocsDemo as |demo|>
  <demo.example @name="date-time-picker.hbs">
    <EmberFlatpickr
      @allowInput={{true}}
      @appendDataInput={{true}}
      @classNames={{this.classString}}
      @date={{readonly this.dateValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @minDate={{this.minDate}}
      @onClose={{action "onClose"}}
      @onChange={{action (mut this.dateValue)}}
      @onReady={{action "onReady"}}
      @placeholder="Pick date"
    />
  </demo.example>
  
  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{this.dateValue}}
    </p>
    
    <h2>Options</h2>
    
    <PowerSelect
      @matchTriggerWidth={{false}}
      @options={{this.locales}}
      @placeholder="Choose a Locale"
      @searchEnabled={{false}}
      @selected={{this.locale}}
      @triggerClass={{this.classString}}
      @onChange={{action (mut this.locale)}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{action "updateMin"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Set minDate to '2080-12-24T16:16:22.585Z'</button>
    <button {{action "clearDate"}} class="docs-btn docs-mt-2 docs-p-2">Clear date</button>
  </div>
  
  <demo.snippet @name="date-time-picker.hbs"/>
</DocsDemo>

## Range Date/Time Picker

<DocsDemo as |demo|>
  <demo.example @name="range-date-time-picker.hbs">
    <EmberFlatpickr
      @allowInput={{true}}
      @appendDataInput={{true}}
      @classNames={{this.classString}}
      @date={{readonly this.dateRangeValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @mode="range"
      @minDate={{this.minDate}}
      @onClose={{action "onClose"}}
      @onChange={{action (mut this.dateRangeValue)}}
      @onReady={{action "onReady"}}
      @placeholder="Pick dates"
    />
  </demo.example>
  
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
      @onChange={{action (mut locale)}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{action "updateMin"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Set minDate to '2080-12-24T16:16:22.585Z'</button>
    <button {{action "clearDate"}} class="docs-btn docs-mt-2 docs-p-2">Clear date</button>
  </div>
  
  <demo.snippet @name="range-date-time-picker.hbs"/>
</DocsDemo>

## Time Picker

<DocsDemo as |demo|>
  <demo.example @name="time-picker.hbs">
    <EmberFlatpickr
      @appendDataInput={{true}}
      @classNames={{this.classString}}
      @date={{readonly this.timeValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @minDate={{this.minDate}}
      @noCalendar={{true}}
      @onClose={{action "onCloseTime"}}
      @onChange={{action (mut this.timeValue)}}
      @onReady={{action "onReadyTime"}}
      @placeholder="Pick time"
    />
  </demo.example>
  
  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{this.timeValue}}
    </p>
    
    <h2>Options</h2>
    
    <button {{action "clearTime"}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">Clear time</button>
  </div>
 
  <demo.snippet @name="time-picker.hbs"/>
</DocsDemo>
