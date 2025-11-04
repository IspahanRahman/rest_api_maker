'use client';
import React, { useState } from 'react';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle login logic here
		alert(`Email: ${email}\nPassword: ${password}`);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-surface">
			<form
				onSubmit={handleSubmit}
				className="bg-surface-card p-8 rounded-lg shadow-md min-w-80"
			>
				<h2 className="text-2xl font-semibold text-center mb-6 text-text-primary-sem">
					Login
				</h2>
				<div className="mb-4">
					<label
						htmlFor="email"
						className="block mb-2 text-sm text-text-secondary"
					>
						Email
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className="w-full px-3 py-2 rounded border border-border-subtle bg-surface-input text-text-primary-sem focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>
				<div className="mb-6">
					<label
						htmlFor="password"
						className="block mb-2 text-sm text-text-secondary"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="w-full px-3 py-2 rounded border border-border-subtle bg-surface-input text-text-primary-sem focus:outline-none focus:ring-2 focus:ring-primary-500"
					/>
				</div>
				<button
					type="submit"
					className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded font-semibold transition-colors"
				>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
