const { join } = require('path');
const Discord = require('discord.js');
const Extendable = require('./Extendable');
const Store = require('./interfaces/Store');

/**
 * Stores all of our extendables that extend Discord.js
 * @extends external:Collection
 * @implements {Store}
 */
class ExtendableStore extends Discord.Collection {

	/**
	 * Constructs our ExtendableStore for use in Klasa
	 * @param  {KlasaClient} client The Klasa client
	 */
	constructor(client) {
		super();
		/**
		 * The client this ExtendableStore was created with.
		 * @name ExtendableStore#client
		 * @type {KlasaClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

		/**
		* The directory of extendables in Klasa relative to where its installed.
		 * @type {String}
		 */
		this.coreDir = join(this.client.coreBaseDir, 'extendables');

		/**
		* The directory of local extendables relative to where you run Klasa from.
		 * @type {String}
		 */
		this.userDir = join(this.client.clientBaseDir, 'extendables');

		/**
		 * The type of structure this store holds
		 * @type {Extendable}
		 */
		this.holds = Extendable;
	}

	/**
	 * Deletes an extendable from the store.
	 * @param {Extendable|string} name A extendable object or a string representing a command or alias name.
	 * @returns {boolean} whether or not the delete was successful.
	 */
	delete(name) {
		const extendable = this.resolve(name);
		if (!extendable) return false;
		for (const structure of extendable.appliesTo) delete Discord[structure].prototype[this.name];
		super.delete(extendable.name);
		return true;
	}

	/**
	 * Clears the extendable from the store and removes the extensions.
	 * @return {void}
	 */
	clear() {
		for (const extendable of this.keys()) this.delete(extendable);
	}

	/**
	 * Sets up an extendable in our store.
	 * @param {Extendable} extendable The extendable object we are setting up.
	 * @returns {Extendable}
	 */
	set(extendable) {
		if (!(extendable instanceof Extendable)) return this.client.emit('error', 'Only extendables may be stored in the ExtendableStore.');
		extendable.init();
		super.set(extendable.name, extendable);
		return extendable;
	}

	// left for documentation
	/* eslint-disable no-empty-function */
	init() {}
	load() {}
	async loadAll() {}
	resolve() {}
	/* eslint-enable no-empty-function */

}

Store.applyToClass(ExtendableStore);

module.exports = ExtendableStore;
