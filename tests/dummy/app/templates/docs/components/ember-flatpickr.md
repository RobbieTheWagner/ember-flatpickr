# ember-flatpickr

## Date/Time Picker

<DocsDemo as |demo|>
  <demo.example @name="date-time-picker.hbs">
    <EmberFlatpickr
      @allowInput={{true}}
      @date={{this.dateValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @minDate={{this.minDate}}
      @onClose={{this.onClose}}
      @onChange={{this.onDateChange}}
      @onReady={{this.onReady}}
      placeholder="Pick date"
      class={{this.classString}}
    />
  </demo.example>

  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{this.dateValue}}
    </p>
    
    <h2>Options</h2>
    
    <PowerSelect
      @matchTriggerWidth={{true}}
      @options={{this.locales}}
      @placeholder="Choose a Locale"
      @searchEnabled={{false}}
      @selected={{this.locale}}
      @triggerClass={{this.classString}}
      @onChange={{this.onChangeLocale}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{on "click" this.updateMin}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">
      Set minDate to '2080-12-24T16:16:22.585Z'
    </button>
    <button {{on "click" this.clearDate}} class="docs-btn docs-mt-2 docs-p-2">
      Clear date
    </button>
  </div>
  
  <demo.snippet @name="date-time-picker.hbs"/>
</DocsDemo>

## Range Date/Time Picker

<DocsDemo as |demo|>
  <demo.example @name="range-date-time-picker.hbs">
    <EmberFlatpickr
      @allowInput={{true}}
      @date={{this.dateRangeValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @mode="range"
      @minDate={{this.minDate}}
      @onClose={{this.onClose}}
      @onChange={{this.onDatesChange}}
      @onReady={{this.onReady}}
      placeholder="Pick dates"
      class={{this.classString}}
    />
  </demo.example>

  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{this.dateRangeValue}}
    </p>
    
    <h2>Options</h2>
    
    <PowerSelect
      @matchTriggerWidth={{true}}
      @options={{this.locales}}
      @placeholder="Choose a Locale"
      @searchEnabled={{false}}
      @selected={{this.locale}}
      @triggerClass={{this.classString}}
      @onChange={{this.onChangeLocale}}
    as |option|
    >
      {{option}}
    </PowerSelect>
    
    <button {{on "click" this.updateMin}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">
      Set minDate to '2080-12-24T16:16:22.585Z'
    </button>
    <button {{on "click" this.clearDate}} class="docs-btn docs-mt-2 docs-p-2">
      Clear date
    </button>
  </div>
  
  <demo.snippet @name="range-date-time-picker.hbs"/>
</DocsDemo>

## Time Picker

<DocsDemo as |demo|>
  <demo.example @name="time-picker.hbs">
    <EmberFlatpickr
      @date={{this.timeValue}}
      @enableTime={{true}}
      @locale={{this.locale}}
      @minDate={{this.minDate}}
      @noCalendar={{true}}
      @onClose={{this.onCloseTime}}
      @onChange={{this.onTimeChange}}
      @onReady={{this.onReadyTime}}
      placeholder="Pick time"
      class={{this.classString}}
    />
  </demo.example>

  <div class="docs-m-4">
    <p class="selectedValue">
      You selected: {{this.timeValue}}
    </p>
    
    <h2>Options</h2>
    
    <button {{on "click" this.clearTime}} class="docs-btn docs-mt-2 docs-mr-2 docs-p-2">
      Clear time
    </button>
  </div>
 
  <demo.snippet @name="time-picker.hbs"/>
</DocsDemo>
