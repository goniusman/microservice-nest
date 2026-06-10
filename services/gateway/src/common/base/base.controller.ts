// import {
//     BadRequestException,
//     Body,
//     Controller,
//     Delete,
//     Get,
//     HttpStatus,
//     Param,
//     Patch,
//     Post,
//     Req,
//     Res
// } from '@nestjs/common'
// import { Document } from 'mongoose'
// import { BaseService } from './base.service'
// import { getDtoClass } from '../utils/dto-registry'
// import { validateDto } from './dto.validation'

// @Controller()
// export abstract class BaseController<T extends Document, CreateDto, UpdateDto> {
//     constructor(protected readonly service: BaseService<T, CreateDto, UpdateDto>) { }

//     @Post()
//     async create(@Body() createDto: CreateDto, @Req() req: any, @Res() res: any) {
//         try {
//             // Get DTO class based on URL
//             const url = req.url.split('/')
//             const dtoClass = await getDtoClass(url[url.length - 1]) // Strip query params
//             if (dtoClass) {
//                 await validateDto(createDto, dtoClass)
//                 console.log('BaseController: Validated DTO:', createDto, 'URL:', req.url)
//             }
//             return res.status(HttpStatus.OK).json({
//                 statusCode: HttpStatus.OK,
//                 status: true,
//                 message: 'Created successfully',
//                 data: await this.service.create(createDto)
//             })
//         } catch (error) {
//             console.log('==================<<>>error.message', error.message)
//             return new BadRequestException(error.message)
//         }
//     }

//     @Get()
//     async findAll(@Res() res: any) {
//         return res.status(HttpStatus.OK).json({
//             statusCode: HttpStatus.OK,
//             status: true,
//             message: 'Fetch successfully',
//             data: await this.service.findAll()
//         })
//     }

//     @Get(':id')
//     async findOne(@Param('id') id: string, @Res() res: any) {
//         return res.status(HttpStatus.OK).json({
//             statusCode: HttpStatus.OK,
//             status: true,
//             message: 'Fetch successfully',
//             data: await this.service.findOne(id)
//         })
//     }

//     @Patch(':id')
//     async update(@Param('id') id: string, @Body() updateDto: UpdateDto, @Res() res: any) {
//         return res.status(HttpStatus.OK).json({
//             statusCode: HttpStatus.OK,
//             status: true,
//             message: 'Updated successfully',
//             data: await this.service.update(id, updateDto)
//         })
//     }

//     @Delete(':id')
//     async remove(@Param('id') id: string, @Res() res: any) {
//         return res.status(HttpStatus.OK).json({
//             statusCode: HttpStatus.OK,
//             status: true,
//             message: 'Updated successfully',
//             data: await this.service.remove(id)
//         })
//     }
// }
