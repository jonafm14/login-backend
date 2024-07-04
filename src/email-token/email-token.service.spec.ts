import { Test, TestingModule } from '@nestjs/testing';
import { EmailTokenService } from './email-token.service';

describe('EmailTokenService', () => {
  let service: EmailTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailTokenService],
    }).compile();

    service = module.get<EmailTokenService>(EmailTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
