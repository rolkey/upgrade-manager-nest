import { Test, TestingModule } from '@nestjs/testing';
import { UpgradesService } from './upgrades.service';

describe('UpgradesService', () => {
  let service: UpgradesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpgradesService]
    }).compile();

    service = module.get<UpgradesService>(UpgradesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
