![General Assembly Logo](http://i.imgur.com/ke8USTq.png)

# Ember CRUD

In the last session, we set out to have an Ember application that could perform
 CRUD on two separate and unrelated resources,'pokemon' and 'items'.
This is useful for a demonstration, but most of the time (as you probably know
 by now) your application will need to employ some form of relationship.
We will now explore how you can implement one-to-many relationships in an Ember
 application, and how to perform CRUD operations on these related resources.

## Prerequisites

By now, you have already learned how to:

- Create Ember Components to represent UI elements and encapsulate related data and behavior.
- Use `ember-data` to set up Models representing business data.
- Link the `ember-data` data store to a JSON API through an Adapter.

### Objectives

By the end of this session, you should be able to:

-  Create a one-to-many relationship between two Models.
-  Create a new dependent record.
-  Update a relationship between two records.
-  Implement 'dependent-destroy' on the front end, so that when a parent record
    is destroyed, its dependent records are too.

### Setup

1. Fork and clone this repo.
1. Run `npm install` and `bower install`
1. Go to the `ember-resources-api` repo that you've already cloned, and run
    `git checkout 010/ember-resources-one-to-many`.
1. Rub `bundle install` in the Rails repo, just as a precaution.
1. Run `rake db:drop db:create db:migrate db:example:all`

## `ember-data` Associations : One-to-Many

Let's take our application to the next level and add a new feature: _sightings_!

Every time someone spots a Pokemon, they'll create a new record in our
 application indicating

- what Pokemon they saw
- where and when they saw it
- who made the observation

Since many different people can see the same Pokemon (even in different places),
 this is clearly a one-to-many relationship.

As you can see we've already go a new Template (+ Route) routed up, along with a
 link from the `index` Template.
We've even got a model in place, with all of the attributes of a Sighting, and a
 `sighting-snippet` component to represent each sighting on the page.
Everything's ready, so let's get started!

### Code-Along : Link the Sighting and Pokemon Models

Since we have our Models already, the process of linking them together is
 actually quite easy!
Let's add a new `pokemon` attribute to the `sighting` model.
Unlike the others, which use `DS.attr`, we define relationships with separate
 methods : `.hasMany` and `.belongsTo`

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

```javascript
import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  nationalPokeNum: DS.attr('number'),
  name: DS.attr('string'),
  typeOne: DS.attr('string'),
  typeTwo: DS.attr('string'),
  types: Ember.computed.collect('typeOne', 'typeTwo'),
  generation: DS.attr('number'),
  totalPoints: DS.attr('number'),
  baseHp: DS.attr('number'),
  baseAttack: DS.attr('number'),
  baseDefense: DS.attr('number'),
  baseSpAttack: DS.attr('number'),
  baseSpDefense: DS.attr('number'),
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

```js
// pokemon-snippet/component.js
numSightings: Ember.computed('pokemon.sightings.@each', function(){
  return this.get('pokemon.sightings').get('length');
})
```

Then, all you'd need to do is reference that property in the Component Template.

```html
<!-- pokemon-snippet/template.hbs -->
<p>Sightings So Far: {{numSightings}}</p>
```

It would also be a good idea to add `snippets` to the set of models loaded by
 the `pokemon` Route, to ensure that the data store has up to date records on
 both `pokemon` and `snippets` before loading the page.

```js
model: function(){
  return Ember.RSVP.hash({
    pokemon: this.store.findAll('pokemon'),
    sightings: this.store.findAll('sightings')
  });
}
```

Of course, doing this means that we'll need to update the `/pokemon` Template
 accordingly, by changing `model` to `model.pokemon`.

```html
{{#each model.pokemon as |eachPokemon|}}
```

Now let's do the reverse by adding a reference to a Pokemon to the '
 `sighting-snippet` template.
Instead of saying "A Pokemon was seen", it should specify _which_ Pokemon was
 spotted.

```html
<p>A {{sighting.pokemon.name}} was seen at {{sighting.location}}</p>
```

Just as we did in the first case, we should make the `sightings` Route load up
 Pokemon as well as Sightings, and we'll need to update the top-level Template
 too.

### Code-Along : Create a New Dependent Record, with Association

As with our other resources, if we want to create new Sighting instances, we're
 going to need a form so that we can input the new data.
Let's generate a new component called `sighting-form`, with the same structure
 as the forms for Pokemon and Items.

Given how we set up the Components for creating new Pokemon and Items, our new
 Component Template and Component Object should look something like this:

```html
<h5> Report a Pokemon Sighting </h5>
<div>
  {{input placeholder='Location' value=form.location}}
  {{input placeholder='Date and Time' value=form.observationTime}}
  {{input placeholder='Observer' value=sightingForm.observer}}
</div>
<button {{action 'createSighting'}}> Submit </button>
```

```js
form: {},
actions: {
  createSighting: function(){
    console.log('Component Action : createSighting');
    this.sendAction('routeCreateSighting', this.get('form'));
    this.set('form', {});
  }
}
```

In the `sightings` Route, we'll need to modify our `createSighting` action
 to access the Sighting model; based on how this worked with Items and Pokemon,
 we might start off with:

```js
actions: {
 createItem: function(properties){
   console.log('Route Action : createSighting');
   this.store.createRecord('sighting', properties)
     .save().then(()=>console.log('record created'));
 },
 // ...
}
```

Before we move on, there's another complication we need to deal with.
When someone inputs a date/time into the form, it needs to be converted to a
 Date before it can be passed to the back end.
We could try and handle this in the Route, but it's really more of a UI concern
 so let's handle it in the Component instead.

Binding to the `form` object is really convenient, but it doesn't give us any
 opportunity to transform the data in the middle of the binding process.
One way we might address this is by creating a new computed property that's
 _based on_ `form` (but with some modifications), and pass that new property
 up through `sendAction` instead.
Let's call this new property `sightingProperties`.

```js
form: {},
sightingProperties: Ember.computed('form', function(){
  return {
    location: this.get('form.location'),
    observationTime: new Date(this.get('form.observationTime')),
    observer: this.get('form.observer')
  };
}),
```

Our API has the constraint, however, that `pokemon_id` must not be null --
 in other words, every sighting _must_ be associated with a Pokemon.

The API does not get hit until we call `.save()`; therefore, we'll need to
 modify the Sighting record before then if we want the API to accept our
 request.
To actually associate the new sighting with a given Pokemon, we simply add this
 new sighting to the list of that Pokemon's sightings.

```js
actions: {
  createItem: function(properties){
    console.log('Route Action : createSighting');
    let newSighting = this.store.createRecord('sighting', properties);
    let pokemon = // ...
    pokemon.get('sightings').pushObject(newSighting);
    newSighting.save().then(()=>console.log('record created'));
  },
  // ...
}
```

Suppose that we know what Pokemon was sighting because that value gets passed in
 throught the `create-sighting` form. In that case, that additional piece of
 data might get passed up along with the properties for the new Sighting.
Given the name of the Pokemon that was seen, we can search through the list of
 Pokemon, find a matching name, and add the new sighting to the given Pokemon's
 properties.

If we use `findAll('pokemon')`, we're going to need to use Promises to handle
 the results.

```js
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
},
```

Since we want the user to be filling out the name of the Pokemon they saw in the
 form, what we need to do is collect `pokemonName` from the form as well, and
 pass it up to the Route as an argument of `sendAction`.

```html
<div>
 {{input placeholder='Pokemon' value=pokemonName}}
 {{input placeholder='Location' value=form.location}}
 {{input placeholder='Date and Time' value=form.observationTime}}
 {{input placeholder='Observer' value=form.observer}}
</div>
```

```js
pokemonName: '',
actions: {
  createSighting: function(){
    console.log('Component Action : createSighting');
    this.sendAction('routeCreateSighting',
        this.get('form'),
        this.get('pokemonName'));
    this.set('form', {});
    this.set('pokemonName', '');
  }
}
```

We've created a new stand-alone property to represent the name
 of the Pokemon that was spotted.
This is fine in this case, but could be tedious if we had lots of additional
 properties that we cared about.
A more general approach might be to load `pokemonName` as part of `form`, and
 parse it out again through a computed property, just like we did with
 `sightingProperties`.

 ```html
 <div>
  {{input placeholder='Pokemon' value=form.pokemonName}}
  {{input placeholder='Location' value=form.location}}
  {{input placeholder='Date and Time' value=form.observationTime}}
  {{input placeholder='Observer' value=form.observer}}
 </div>
 ```

 ```js
 pokemonName: Ember.computed('form', function(){
   return this.get('form.pokemonName')
 }),
 actions: {
   createSighting: function(){
     console.log('Component Action : createSighting');
     this.sendAction('routeCreateSighting',
         this.get('form'),
         this.get('pokemonName'));
     this.set('form', {});
   }
 }
 ```

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

## Additional Resources
- [Ember Guides](https://guides.emberjs.com/v2.2.0/models/working-with-relationships/)
