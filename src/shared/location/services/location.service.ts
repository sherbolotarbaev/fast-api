import {
  Inject,
  Injectable,
  Logger,
  NotImplementedException,
} from '@nestjs/common';

// import { type ISecurityConfig, SecurityConfig } from '~/config';
import { type ISecurityConfig, SecurityConfig } from '../../../config'; // fix: vercel issue
// import { ErrorEnum } from '~/constants/error.constant';
import { ErrorEnum } from '../../../constants/error.constant'; // fix: vercel issue

import IPinfoWrapper, { IPinfo } from 'node-ipinfo';

import { GetLocationDto } from '../dto';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);
  private readonly iPinfo: IPinfoWrapper;

  constructor(
    @Inject(SecurityConfig.KEY)
    private readonly securityConfig: ISecurityConfig,
  ) {
    this.iPinfo = new IPinfoWrapper(this.securityConfig.ipInfoApiKey);
  }

  public async getLocation({ ip }: GetLocationDto): Promise<IPinfo> {
    try {
      const data = await this.iPinfo.lookupIp(ip);
      return data;
    } catch (error) {
      this.logger.error('Failed to get location:', error);
      throw new NotImplementedException(ErrorEnum.GET_LOCATION_FAILED);
    }
  }
}
