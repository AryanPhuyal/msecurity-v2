import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  ManyToOne,
} from "typeorm";
import { License } from "./License.entity";
import Partner from "./Partner.entity";

@Entity("tranjection")
export default class Tranjection {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  cost!: number;

  @ManyToOne(() => Partner, (partner) => partner.tranjections)
  partner!: Partner;

  @OneToMany(() => License, (license) => license.tranjection)
  licenses!: License[];
}
