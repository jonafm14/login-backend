import { PartialType } from '@nestjs/mapped-types';
import { CreateEmailTokenDto } from './create-email-token.dto';

export class UpdateEmailTokenDto extends PartialType(CreateEmailTokenDto) {
    id: string
}
