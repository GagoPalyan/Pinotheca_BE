import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { TranslationsModule } from "./translations/translations.module";
import { PicturesModule } from "./pictures/pictures.module";
import { AuthorsModule } from "./authors/authors.module";

@Module({
  imports: [
    AuthModule,
    TranslationsModule,
    PicturesModule,
    AuthorsModule,
  ],
})
export class ApiModule {}
