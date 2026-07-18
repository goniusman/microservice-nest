import { SetMetadata } from '@nestjs/common';

export const BYPASS_KEY = 'bypassInterceptor';
export const BypassInterceptor = () => SetMetadata(BYPASS_KEY, true);
