import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Column,
} from "typeorm";
import { License } from "./License.entity";

@Entity("user")
export default class User {
  [x: string]: any;
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({})
  password!: string;

  @Column()
  firstname!: string;

  @Column()
  lastname!: string;

  @Column({ nullable: true })
  middlename!: string;

  @Column({ default: "normal" })
  role!: string;

  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  public createdAt!: Date;

  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  public updatedAt!: Date;

  @OneToMany(() => License, (license) => license.user)
  licenses!: License[];
}
