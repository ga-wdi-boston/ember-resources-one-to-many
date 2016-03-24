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
We've even got a model in place, with all of the attributes of a Sighting.

### Code-Along : Link the Sighting and Pokemon Models

### Code-Along : Show Linked Data in a Template

### Code-Along : Create a New Dependent Record, with Association

### Code-Along : Implement "Dependent-Destroy" on the Front End

### Code-Along : Update a Dependent Record's' Associations

Now that the groundwork has been laid, let's come back to the topic of associations. In this app, we will model the relationship between resources 'generation' and 'pokemon' as a one-to-many relationship, where one 'generation' is associated with many different 'pokemon'.

We can define this relationship in the 'generation' Model as follows:
```javascript
export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  games: DS.attr(),
  pokemon: DS.hasMany('pokemon', {async: true})
});
```
> `{async: true}` is a configuration setting on `DS.hasMany` that controls a kind of behavior called 'eager/lazy loading'. Don't worry about the details on this right now.

In the 'pokemon' Model, we need to change the 'generation' property from being a number to being a relationship.
```javascript
export default DS.Model.extend({
  nationalPokeNum: DS.attr('number'),
  name: DS.attr('string'),
  typeOne: DS.attr('string'),
  typeTwo: DS.attr('string'),
  // generation: DS.attr('number')
  generation: DS.belongsTo('generation', {async: true})
});
```


## Additional Resources
- [Ember Guides](https://guides.emberjs.com/v2.2.0/models/working-with-relationships/)
