import { ENV_CONFIG } from '../config/env';

declare global {
	interface Window {
		flex?: any;
	}
}

const CYBERSOURCE_FLEX_SDK_URL = 'https://flex.cybersource.com/flex-microform/flex-microform.min.js';

export interface CreateChargeRequestBody {
	amount: number;
	currency: string;
	transientToken: string;
	referenceId?: string;
	customerEmail?: string;
}

export interface CreateChargeResponseBody {
	success: boolean;
	paymentId?: string;
	status?: string;
	message?: string;
}

export async function loadFlexLibrary(): Promise<void> {
	if (window.flex) return;

	// Check if we're running over HTTPS
	if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
		throw new Error('CyberSource Flex SDK requires HTTPS. Please run your development server with HTTPS enabled.');
	}

	await new Promise<void>((resolve, reject) => {
		const existingScript = document.querySelector(`script[src="${CYBERSOURCE_FLEX_SDK_URL}"]`) as HTMLScriptElement | null;
		if (existingScript) {
			existingScript.addEventListener('load', () => resolve());
			existingScript.addEventListener('error', () => reject(new Error('Failed to load CyberSource Flex SDK')));
			return;
		}

		const script = document.createElement('script');
		script.src = CYBERSOURCE_FLEX_SDK_URL;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Failed to load CyberSource Flex SDK. Make sure you are running over HTTPS.'));
		document.body.appendChild(script);
	});
}

export async function fetchCaptureContext(): Promise<string> {
	const response = await fetch(`${ENV_CONFIG.API_BASE_URL}/api/payments/cybersource/capture-context`, {
		method: 'GET',
		headers: { 'Accept': 'application/json' },
		credentials: 'include',
	});
	if (!response.ok) {
		throw new Error('Failed to fetch CyberSource capture context');
	}
	const data = await response.json() as { captureContext: string };
	return data.captureContext;
}

export interface CreateMicroformParams {
	captureContext: string;
	cardNumberContainer: HTMLElement;
	securityCodeContainer: HTMLElement;
	cardPlaceholder?: string;
	cvvPlaceholder?: string;
}

export async function createMicroform(params: CreateMicroformParams) {
	const { captureContext, cardNumberContainer, securityCodeContainer, cardPlaceholder, cvvPlaceholder } = params;
	if (!window.flex) throw new Error('CyberSource Flex SDK not loaded');

	const microform = new window.flex.microform({ captureContext });

	const number = microform.createField('number', {
		placeholder: cardPlaceholder || 'Card number',
		styles: {
			input: { 'font-size': '16px' },
			'input.is-invalid': { color: 'crimson' },
			'input.is-valid': { color: 'green' },
		},
	});

	const securityCode = microform.createField('securityCode', {
		placeholder: cvvPlaceholder || 'CVV',
		styles: {
			input: { 'font-size': '16px' },
			'input.is-invalid': { color: 'crimson' },
			'input.is-valid': { color: 'green' },
		},
	});

	number.load(cardNumberContainer);
	securityCode.load(securityCodeContainer);

	return { microform, number, securityCode };
}

export interface TokenizeResult {
	transientToken: string;
}

export async function tokenizeCard(microform: any, additionalData?: { expirationMonth?: string; expirationYear?: string; }) : Promise<TokenizeResult> {
	return await new Promise<TokenizeResult>((resolve, reject) => {
		microform.createToken({
			expirationMonth: additionalData?.expirationMonth,
			expirationYear: additionalData?.expirationYear,
		}, (err: unknown, tokenData: { token: string }) => {
			if (err) {
				reject(new Error('Failed to tokenize card'));
				return;
			}
			resolve({ transientToken: tokenData.token });
		});
	});
}

export async function chargePayment(body: CreateChargeRequestBody): Promise<CreateChargeResponseBody> {
	const response = await fetch(`${ENV_CONFIG.API_BASE_URL}/api/payments/cybersource/charge`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
		credentials: 'include',
	});
	if (!response.ok) {
		const text = await response.text();
		throw new Error(text || 'CyberSource charge request failed');
	}
	return await response.json() as CreateChargeResponseBody;
}



