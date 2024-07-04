import { Test, TestingModule } from '@nestjs/testing';
import { EmailTokenController } from './email-token.controller';
import { EmailTokenService } from './email-token.service';

describe('EmailTokenController', () => {
  let controller: EmailTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailTokenController],
      providers: [EmailTokenService],
    }).compile();

    controller = module.get<EmailTokenController>(EmailTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
