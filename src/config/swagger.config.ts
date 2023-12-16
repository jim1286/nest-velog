import { DocumentBuilder } from '@nestjs/swagger';

export class BaseAPIDocumentation {
  public builder = new DocumentBuilder();

  public initializeOptions() {
    return this.builder
      .setTitle('Velog API')
      .setDescription('API docs')
      .setVersion('1.0.0')
      .addTag('swagger')
      .build();
  }
}
