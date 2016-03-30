[![General Assembly Logo](https://camo.githubusercontent.com/1a91b05b8f4d44b5bbfb83abac2b0996d8e26c92/687474703a2f2f692e696d6775722e636f6d2f6b6538555354712e706e67)](https://generalassemb.ly/education/web-development-immersive)

# Ember Resources : One-to-Many

In the last session, we set out to have an Ember application that could perform
 CRUD on two separate and unrelated resources,'pokemon' and 'items'.
This is useful for a demonstration, but most of the time (as you probably know
 by now) your application will need to employ some form of relationship.
We will now explore how you can implement one-to-many relationships in an Ember
 application, and how to perform CRUD operations on these related resources.

## Prerequisites

By now, you have already learned how to:

-   Create Ember Components to represent UI elements and encapsulate related
     data and behavior.
-   Use `ember-data` to set up Models representing business data.
-   Link the `ember-data` data store to a JSON API through an Adapter.

### Objectives

By the end of this session, you should be able to:

-   Create a one-to-many relationship between two Models.
-   Create a new dependent record.
-   Update a relationship between two records.
-   Implement 'dependent-destroy' on the front end, so that when a parent record
     is destroyed, its dependent records are too.

### Setup

1.  Fork and clone this repo.
1.  Run `npm install` and `bower install`
1.  Go to the `ember-resources-api` repo that you've already cloned, and run
     `git checkout 010/ember-resources-one-to-many`.
1.  Rub `bundle install` in the Rails repo, just as a precaution.
1.  Run `rake db:drop db:create db:migrate db:example:all`

## `ember-data` Associations : One-to-Many

Let's take our application to the next level and add a new feature: _sightings_!

Every time someone spots a Pokemon, they'll create a new record in our
 application indicating

-   what Pokemon they saw
-   where and when they saw it
-   who made the observation

Since many different people can see the same Pokemon (even in different places),
 this is clearly a one-to-many relationship.

As you can see we've already go a new Template (+ Route) routed up, along with a
 link from the `index` Template.
We've even got a model in place, with all of the attributes of a Sighting, and
 two components: a `sighting-snippet` component to represent each Sighting on
 the page, and a `sighting-form` component for creating new Sightings.
Everything's ready, so let's get started!

### Code-Along : Link the Sighting and Pokemon Models

Since we have our Models already, the process of linking them together is
 actually quite easy!
Let's add a new `pokemon` attribute to the `sighting` model.
Unlike the others, which use `DS.attr`, we define relationships with separate
 methods : `.hasMany` and `.belongsTo`

**app / sighting / model.js**

```javascript
export default DS.Model.extend({
  observationTime: DS.attr('date'),
  location: DS.attr('string'),
  observer: DS.attr('string'),
  pokemon: DS.belongsTo('pokemon', {async: true})
});
```

> `{async: true}` is a configuration setting on `DS.hasMany` that controls a
>  kind of behavior called 'eager/lazy loading'.
> Don't worry about the details on this right now.

Then, in the `pokemon` Model, we need to add a new property called `sightings`
 with the inverse relationship, `hasMany`.

**app / pokemon / model.js**

```javascript
export default DS.Model.extend({
  // ...
  baseSpeed: DS.attr('number'),
  sightings: DS.hasMany('sightings', {async: true})
});
```

### Code-Along : Show Linked Data in a Template

Once we've linked up our models, accessing and showing linked data is easy.

Suppose that in addition to showing other data, we want `pokemon-snippet` to
 show the number of times a particular Pokemon has been seen.

Since the two models are already associated, all we can define a computed
 property in the Component to get the total number of sightings of that
 Component's Pokemon.

**app / components / pokemon-snippet / component.js**

```js
export default Ember.Component.extend({
  // ...
  numSightings: Ember.computed('pokemon.sightings.@each', function(){
    return this.get('pokemon.sightings').get('length');
  })
  // ...
});
```

Then, all you'd need to do is reference that property in the Component Template.

**app / components / pokemon-snippet / template.hbs**

```html
  <!-- ... -->
  <p>Sightings So Far: {{numSightings}}</p>
{{else}}
  <!-- ... -->
```

It would also be a good idea to add `snippets` to the set of models loaded by
 the `pokemon` Route, to ensure that the data store has up to date records on
 both `pokemon` and `snippets` before loading the page.

**app / pokemon / route.js**

```js
export default Ember.Route.extend({
  model: function(){
    return Ember.RSVP.hash({
      pokemon: this.store.findAll('pokemon'),
      sightings: this.store.findAll('sightings')
    });
  },
  // ...
});
```

Of course, doing this means that we'll need to update the `/pokemon` Template
 accordingly, by changing `model` to `model.pokemon`.

**app / pokemon / template.hbs**

```html
<!-- ... -->
{{#each model.pokemon as |eachPokemon|}}
<!-- ... -->
```

Now let's do the reverse by adding a reference to a Pokemon to the '
 `sighting-snippet` template.
Instead of saying "A Pokemon was seen", it should specify _which_ Pokemon was
 spotted.

**app / components / sighting-snippet / template.js**

```html
<!-- ... -->
<p>A {{sighting.pokemon.name}} was seen at {{sighting.location}}</p>
<!-- ... -->
```

Just as we did in the first case, we should make the `sightings` Route load up
 Pokemon as well as Sightings, and we'll need to update the top-level Template
 too.

### Code-Along : Create a New Dependent Record, with Association

#### Clean Up Form Inputs

As mentioned, a `sighting-form` Component has already been created.
However, there's a complication we need to deal with before we can start
 creating new Sightings: when someone inputs a date/time into the form, it needs
 to be converted to a Date before it can be passed to the back end.
We could try and handle this in the Route, but it's really more of a UI concern,
 so let's handle it in the Component instead.

Although binding the template to the `form` object is really convenient, it
 doesn't give us any opportunity to transform the data before it gets to `form`.
One way we might address this is by creating a new computed property that's
 _based on_ `form` (but with some modifications), and pass that computed
 property up through `sendAction` instead.
Let's call this new property `sightingProperties`.

**app / components / sighting-form / component.js**

```js
export default Ember.Component.extend({
  form: {},
  sightingProperties: Ember.computed('form', function(){
   return {
     location: this.get('form.location'),
     observationTime: new Date(this.get('form.observationTime')),
     observer: this.get('form.observer')
   };
  }),
  actions: {
    createSighting: function(){
      console.log('Component Action : createSighting');
      this.sendAction('routeCreateSighting', this.get('sightingProperties'));
      this.set('form', {});
    }
  }
});
```

We still can't create a new Sighting - our API has the constraint that
 `pokemon_id` must not be null, so every sighting _must_ be associated with a
  Pokemon.
However, all of the other properties are set.

#### Create a New Sighting Record

To actually associate a new sighting with a given Pokemon, we simply need to add
 that new sighting to the list of that Pokemon's sightings.
Fortunately, the API does not get hit until we call `.save()`, so all we have to
 do is associate our new Sighting with a Pokemon first.

**app / sightings / route.js**

```js
export default Ember.Route.extend({
  // ...
  actions: {
    createSighting: function(properties){
      console.log('Route Action : createSighting');
      let newSighting = this.store.createRecord('sighting', properties);
      let pokemon = // ...
      pokemon.get('sightings').pushObject(newSighting);
      newSighting.save().then(()=>console.log('record created'));
    },
    // ...
  }
});
```

Suppose that we know what Pokemon was spotted because people record it when they
 report new Pokemon sightings.
In that case, that additional piece of data (`pokemonName`) comes in through the
 `create-sighting` form and gets passed up to the Route, along with the
  properties for the new Sighting.

Given the name of the Pokemon that was seen, we can search through the list of
 Pokemon, find a matching name, and add the new sighting to the given Pokemon's
 properties.
Note that if we use `findAll('pokemon')` to retrieve all Pokemon (so that we can
 search through them and find a match), we're going to need to use Promises to
 handle the results.

**app / sightings / route.js**

```js
export default Ember.Route.extend({
  // ...
  actions: {
    createSighting: function(properties, pokemonName){
      console.log('Route Action : createSighting');
      this.store.findAll('pokemon')
        .then((allPokemon) => {
          return allPokemon.find((pokemon) => pokemon.get('name') === pokemonName);
        })
        .then((pokemon) => {
          if (pokemon) {  // not finding a match is not the same as failure
            let newSighting = this.store.createRecord('sighting', properties);
            pokemon.get('sightings').pushObject(newSighting);
            newSighting.save().then(()=>console.log('record created'));
          }
        });
    },
    // ...
  }
});
```

Since the name of the Pokemon the user saw needs to be part of the form,
 let's add an input field an bind it to a property in the Component,
 `pokemonName`; this can then be passed up to the Route as an argument of
 `sendAction`.

**app / components / sighting-form / template.hbs**

```html
<!-- ... -->
<div>
 {{input placeholder='Pokemon' value=pokemonName}}
 {{input placeholder='Location' value=form.location}}
 {{input placeholder='Date and Time' value=form.observationTime}}
 {{input placeholder='Observer' value=form.observer}}
</div>
<!-- ... -->
```

**app / components / sighting-form / component.js**

```js
export default Ember.Component.extend({
  // ...
  pokemonName: '',
  actions: {
    createSighting: function(){
      console.log('Component Action : createSighting');
      this.sendAction('routeCreateSighting',
          this.get('sightingProperties'),
          this.get('pokemonName'));
      this.set('form', {});
      this.set('pokemonName', '');
    }
  }
});
```

We've created a new stand-alone property to represent the name
 of the Pokemon that was spotted.
This is fine in this case, but could be tedious if we had lots of additional
 properties that we cared about.
A more general approach might be to load `pokemonName` as part of `form`, and
 parse it out again through a computed property.

**app / components / sighting-form / template.hbs**

```html
<!-- ... -->
<div>
  {{input placeholder='Pokemon' value=form.pokemonName}}
  {{input placeholder='Location' value=form.location}}
  {{input placeholder='Date and Time' value=form.observationTime}}
  {{input placeholder='Observer' value=form.observer}}
</div>
<!-- ... -->
```

**app / components / sighting-form / component.js**

```js
export default Ember.Component.extend({
  // ...
  pokemonName: Ember.computed('form', function(){
   return this.get('form.pokemonName')
  }),
  actions: {
   createSighting: function(){
     console.log('Component Action : createSighting');
     this.sendAction('routeCreateSighting',
         this.get('sightingProperties'),
         this.get('pokemonName'));
     this.set('form', {});
   }
  }
});
```

We should now be able to create new Sightings and have them show up on the page.

### Code-Along : Implement "Dependent-Destroy" on the Front End

Many APIs will implement 'dependent-destroy' behavior: in order to prevent the
 creation of orphan records, when a parent record is to be destroyed, all of its
 child records are destroyed first.
However, it's possible that your API may not implement this.
Alternatively, your front-end may be linking two different Web APIs that have no
 knowledge of each other - in that case, something like 'dependent-destroy'
 would impossible to implement on the back-end.

Fortunately, it is not only possible to handle this kind of behavior on Ember,
 it's actually quite easy.

Suppose that we want Pokemon records to destroy their dependent records (in this
 case, Sightings) before they get destroyed.
We already have the machinery in place for destroying Pokemon records:

**app / pokemon / route.js**

```js
export default Ember.Route.extend({
  model: function(){
    return {
      pokemon: this.store.findAll('pokemon'),
      sightings: this.store.findAll('sighting')
    };
  },
  actions: {
    //...
    destroyPokemon: function(pokemon){
      console.log('Route Action : destroyPokemon');
      pokemon.destroyRecord();
    }
  }
});
```

All we need to do is to start by destroying all the Sightings associated with
 that Pokemon.

**app / pokemon / route.js**

```js
export default Ember.Route.extend({
 model: function(){
   return {
     pokemon: this.store.findAll('pokemon'),
     sightings: this.store.findAll('sighting')
   };
 },
 actions: {
   //...
   destroyPokemon: function(pokemon){
     console.log('Route Action : destroyPokemon');
     pokemon.get('sightings').forEach((sighting) => sighting.destroyRecord());
     pokemon.destroyRecord();
   }
 }
});
```

Easy, right?

### Code-Along : Update a Dependent Record's' Associations

Last but not least, let's handle 'update'.
Since both related resources, Pokemon and Sightings, can already be updated
 independently, the only thing we still need to figure out how to update is
 the relationship itself.
In other words, how can we change the Pokemon that a Sighting refers to?

As with CRUD of non-associated records, the exact way that you handle 'update'
 will depend on your UI.
Let's assume that we want to follow the same "content-editable" approach we've
 used so far, and update a Sighting's association through the `sighting-snippet`
 Component.

Let's update the Template for `sighting-snippet` to add an input box for editing
 the Pokemon that the Sighting refers to, and bind its value to a new property
 on the Component called `pokemonName`.
Although we technically could bind it to a property on `sighting`, `sighting`
 is a model, and the input value of the form is really a UI concern rather than
 a data concern (since it's specific to our 'content-editable' implementation),
 so it would make more sense for it to only exist in the Component.
In any event, we should _not_ bind it to `sighting.pokemon.name` - doing this
 would change _the name of the associated Pokemon_, rather than _which Pokemon_
 the Sighting was associated with.

**app / component / sighting-snippet / template.hbs**

```html
<!-- ... -->
{{else}}
  <p> Pokemon:
    {{input value=pokemonName}}</p>
  <!-- ... -->
{{/unless}}
<!-- ... -->
```

**app / component / sighting-snippet / component.js**

```js
export default Ember.Component.extend({
  isEditable: false,
  doubleClick: function(){
    this.toggleProperty('isEditable');
  },
  pokemonName: '',
  actions: {
    // ...
  }
});
```

We'll need to move this new value up to the Route's actions, so let's pass it to
 `sendAction` as another argument.

**app / component / sighting-snippet / component.js**

```js
export default Ember.Component.extend({
  // ...
  pokemonName: '',
  actions: {
    updateSighting: function(){
      console.log('Component Action : updateSighting');
      this.set('isEditable', false);
      this.sendAction('routeUpdateSighting',
        this.get('sighting'),
        this.get('pokemonName'));
    },
    // ...
  }
});
```

In the Route's `updateSighting` action, we'll need to take this name and use it
 to look up that Pokemon.
Once we've found the Pokemon, we can associate our Sighting with that Pokemon -
 since a Sighting can only be associated with _one_ Pokemon, this will fully
 replace the old relationship.

**app / sightings / route.js**

```js
export default Ember.Route.extend({
  // ...
  actions: {
    // ...
    updateSighting: function(sighting, pokemonName) {
      console.log('Route Action : updateSighting');
      this.store.findAll('pokemon')
        .then((allPokemon) => {
          return allPokemon.find((pokemon) => pokemon.get('name') === pokemonName);
        })
        .then((pokemon) => {
          if (pokemon) {
            pokemon.get('sightings').pushObject(sighting);
          }
          sighting.save();
        });
    },
    // ...
  }
});
```

Let's do one final thing.
At this moment, the form field for the Pokemon's name is blank to start, while
 all of the other fields are populated.
Wouldn't it be great if that showed the name of the Pokemon that the sighting is
 currently associated with?

One way to do this might be to implement "one-way binding" between `pokemonName`
 and `sighting.pokemon.name`, so that changing `sighting.pokemon.name` changes
 `pokemonName`, but not vice-versa.
Fortunately, Ember provides a special computed property called
 `Ember.computed.oneWay` which allows us to do just that.

**app / component / sighting-snippet / component.js**

```js
export default Ember.Component.extend({
  // ...
  pokemonName: Ember.computed.oneWay('sighting.pokemon.name'),
  actions: {
    // ...
  }
});
```

Now when we double click a `sighting-snippet` component, we see the Pokemon's
 name in the field!

## Additional Resources

-   [Ember Guides](https://guides.emberjs.com/v2.2.0/models/working-with-relationships/)

## [License](LICENSE)

Source code distributed under the MIT license. Text and other assets copyright
General Assembly, Inc., all rights reserved.
