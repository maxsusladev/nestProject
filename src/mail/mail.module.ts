import { Global, Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from "path"
import * as ejs from "ejs"
import { strict } from 'assert';


@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [
        ConfigService
      ],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('appConfig.mailHost'),
          secure: false,
          port: 2525,
          auth: {
            user: config.get('appConfig.smtpUsername'),
            pass: config.get('appConfig.smtpMailPassword')
          }
        },
        default: {
          from: `My blog <no-reply@nestjs-blog.com>`
        },
        template: {
          dir: join(__dirname, "templates"),
          adapter: {
            compile: (mail, callback) => {
              return ejs.renderFile(mail.data.template, mail.data.context, callback)
            }
          },
          options: {
            strict: false,
          }
        }
      })
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule { }
