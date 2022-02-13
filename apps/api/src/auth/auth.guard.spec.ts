describe('AuthGuard', () => {
	describe('canActivate', () => {
		it.todo('should not require auth for routes without roles configured');

		it.todo('should apply role from API key when in header');

		it.todo('should throw IncorrectApiKeyException when API key in header is incorrect');

		it.todo('should throw MissingApiKeyException when API key in header is missing and default role is not present');

		it.todo('should set default role when API key in header is missing and default role is present');

		it.todo('should throw MissingPermissionsException when API key in header is correct but role does not match');
	});
});
