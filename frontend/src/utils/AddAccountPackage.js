import React from 'react';

export default class AddPackageAccount extends React.Component {

	constructor(props) {
		super(props);

		this.addPackageAccount = this.addPackageAccount.bind(this);
	}
	
	async addPackageAccount(event) {
		// let t = Math.floor(Math.random() * 3);
		// console.log(t);
		let params = {}
		const id = event.target.dataset.id;
		const token = localStorage.getItem('auth_token');

		try {
			if(this.packageName === 'wines') {
				params = {
					wine_id: id,
					bottle_size: '750ml',
					quantity: '1',
					status: 'inventory',
					pending: '0',
					acquisition_value: 300
				}
				
			} else if (this.packageName === 'stamps') {
				params = {
					stamp_id: id,
					wishlist: 0
				}
			} else if (this.packageName === 'arts') {
				params = {
					art_id: id,
					wishlist: 0
				}
			} else if (this.packageName === 'coins') {
				params = {
					coin_id: id,
					wishlist: 0
				}
			}
			
			const response = await fetch(`http://dev-${this.packageName}api.us-east-1.elasticbeanstalk.com/${this.packageName}/accounts`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(params)
			});

			if (!response.ok) {
				var error = new Error(response.statusText)
				error.response = response
				throw error
			}
			const json = await response.json();
			
			// return json;

			console.log(json);
		} catch (e) {
			console.log(e);
		}
	}
}

