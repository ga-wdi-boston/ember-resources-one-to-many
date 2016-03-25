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
  return {
    pokemon: this.store.findAll('pokemon'),
    sightings: this.store.findAll('sightings')
  };
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
<p>{{sighting.pokemon.name}} was seen at {{sighting.location}}</p>
```

Just as we did in the first case, we should make the `/sightings` Route load up
 Pokemon as well as Sightings, and we'll need to update the top-level Template
 too.

### Code-Along : Create a New Dependent Record, with Association



### Code-Along : Implement "Dependent-Destroy" on the Front End

### Code-Along : Update a Dependent Record's' Associations

## Additional Resources
- [Ember Guides](https://guides.emberjs.com/v2.2.0/models/working-with-relationships/)
