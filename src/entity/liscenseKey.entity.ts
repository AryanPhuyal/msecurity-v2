import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
  ManyToOne,
} from "typeorm";
import Partner from "./Partner.entity";
import User from "./User.entity";

@Entity("licenseKey")
export default class LicenseKey {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  key!: String;
  @Column({ default: true })
  live: boolean;

  @ManyToOne(() => User, (user) => user.liscenseKey, {
    nullable: true,
    eager: true,
  })
  user: User;
  @ManyToOne(() => Partner, (partner) => partner.liscenseKey, {
    nullable: true,
    eager: true,
  })
  partner: Partner;
}
