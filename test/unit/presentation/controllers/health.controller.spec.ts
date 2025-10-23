import { HealthController } from '../../../../src/presentation/controllers/health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should return status "ok" with a timestamp', () => {
    const result = controller.check();

    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('timestamp');

    expect(() => new Date(result.timestamp)).not.toThrow();
  });
});
