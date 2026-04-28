import request from './request';
import type { PortalConfig, UpdatePortalConfigDto, Target } from '../types';

export const configApi = {
  get: (target: Target): Promise<PortalConfig | null> => {
    return request.get('/config', { params: { target } });
  },

  update: (target: Target, data: UpdatePortalConfigDto): Promise<PortalConfig> => {
    return request.patch('/config', data, { params: { target } });
  },
};
