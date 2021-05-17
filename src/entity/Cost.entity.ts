import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { License } from "./License.entity";

@Entity()
export default class Cost {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column()
  platform!: string;

  @Column()
  price!: number;

  @Column({ default: false })
  delete!: Boolean;

  @OneToMany(() => License, (license) => license.cost)
  licenses!: License;
}
