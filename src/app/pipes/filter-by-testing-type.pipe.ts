
import { Pipe, PipeTransform } from '@angular/core';



@Pipe({

  name: 'filterByTestingType'

})

export class FilterByTestingTypePipe implements PipeTransform {



  transform(contacts: any[], testingType: string): any[] {

    if (!contacts || !testingType) {

      return contacts;

    }

    return contacts.filter(contact => contact.testingType === testingType);

  }



}
