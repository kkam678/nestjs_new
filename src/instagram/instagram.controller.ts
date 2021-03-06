import {Controller, Get} from "@nestjs/common";
import {InstagramService} from "./instagram.service";

@Controller('instagram')
export class InstagramController {
    constructor(
        private readonly instagramService: InstagramService
    ) {

    }

    @Get('')
    getInsta() {
        this.instagramService.getInstagram();
    }
}
